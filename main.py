from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import webbrowser
from pathlib import Path
from threading import Timer
from urllib import error as urllib_error
from urllib import request as urllib_request

from navigation_service import get_navigation_guidance

PORT = 8000
API_BACKEND = "http://localhost:3000"
ROOT = Path(__file__).resolve().parent


class ProxyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path.startswith("/api/"):
            self._handle_api_get()
            return
        super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/"):
            self._handle_api_post()
            return
        self.send_error(405, "Method Not Allowed")

    def do_OPTIONS(self):
        if self.path.startswith("/api/"):
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            return
        super().do_OPTIONS()

    def _handle_api_get(self):
        if self.path == "/api/health":
            self._send_json(200, {"ok": True, "service": "mentorcliq-nav-assistant"})
            return

        self.send_error(404, "Not Found")

    def _handle_api_post(self):
        if self.path != "/api/navigate":
            self.send_error(404, "Not Found")
            return

        content_length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_length) if content_length else b"{}"

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self._send_json(400, {"error": "Invalid JSON body."})
            return

        question = payload.get("question", "")
        if not isinstance(question, str) or not question.strip():
            self._send_json(400, {"error": "Question is required."})
            return

        question = question.strip()
        if len(question) > 1000:
            self._send_json(400, {"error": "Question is too long. Please keep it under 1000 characters."})
            return

        if self._try_proxy_to_node(question):
            return

        self._send_json(200, get_navigation_guidance(question))

    def _try_proxy_to_node(self, question: str) -> bool:
        request = urllib_request.Request(
            f"{API_BACKEND}/api/navigate",
            data=json.dumps({"question": question}).encode("utf-8"),
            method="POST",
            headers={"Content-Type": "application/json"},
        )

        try:
            with urllib_request.urlopen(request, timeout=1) as response:
                payload = response.read()
                self.send_response(response.status)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(payload)
                return True
        except (urllib_error.URLError, TimeoutError):
            return False

    def _send_json(self, status: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format % args}")


def open_browser():
    webbrowser.open(f"http://localhost:{PORT}")


if __name__ == "__main__":
    server_address = ("127.0.0.1", PORT)
    httpd = HTTPServer(server_address, ProxyHandler)
    print(f"Serving on http://localhost:{PORT}")
    print("Press Ctrl+C to stop.")
    Timer(1.0, open_browser).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
        print("Server stopped")
