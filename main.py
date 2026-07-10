from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8000

if __name__ == "__main__":
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f"Serving on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
        print("Server stopped")
