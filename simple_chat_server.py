import socket
import threading
import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

# Simple chat server using only built-in Python libraries
class ChatServer:
    def __init__(self, host='localhost', port=4000):
        self.host = host
        self.port = port
        self.clients = []
        self.messages = []
        
    def start(self):
        # Start HTTP server for health check
        http_thread = threading.Thread(target=self.start_http_server)
        http_thread.daemon = True
        http_thread.start()
        
        # Start chat server
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.bind((self.host, self.port))
        server.listen(5)
        print(f"🚀 Simple Chat Server running on {self.host}:{self.port}")
        
        while True:
            client, addr = server.accept()
            print(f"New connection from {addr}")
            client_thread = threading.Thread(target=self.handle_client, args=(client,))
            client_thread.daemon = True
            client_thread.start()
    
    def start_http_server(self):
        class HealthHandler(BaseHTTPRequestHandler):
            def do_GET(self):
                if self.path == '/health':
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    response = {'status': 'healthy', 'server': 'python-builtin'}
                    self.wfile.write(json.dumps(response).encode())
                else:
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    html = """
                    <html>
                    <head><title>Chat Server</title></head>
                    <body>
                        <h1>Simple Chat Server is Running!</h1>
                        <p>This server uses only Python built-in libraries</p>
                        <p><a href="/health">Health Check</a></p>
                    </body>
                    </html>
                    """
                    self.wfile.write(html.encode())
        
        http_server = HTTPServer(('localhost', 4001), HealthHandler)
        http_server.serve_forever()
    
    def handle_client(self, client):
        self.clients.append(client)
        try:
            while True:
                data = client.recv(1024).decode()
                if not data:
                    break
                
                try:
                    message = json.loads(data)
                    self.broadcast(message, client)
                except json.JSONDecodeError:
                    pass
        except:
            pass
        finally:
            self.clients.remove(client)
            client.close()
    
    def broadcast(self, message, sender):
        for client in self.clients:
            if client != sender:
                try:
                    client.send(json.dumps(message).encode())
                except:
                    pass

if __name__ == '__main__':
    server = ChatServer()
    server.start() 