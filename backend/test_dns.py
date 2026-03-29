import socket
import httpx

_orig_getaddrinfo = socket.getaddrinfo

def patched_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    if "neon.tech" in host:
        try:
            url = f"https://dns.google/resolve?name={host}&type=A"
            r = httpx.get(url, timeout=5.0)
            if r.status_code == 200:
                data = r.json()
                for answer in data.get("Answer", []):
                    if answer.get("type") == 1: # A record
                        ip = answer.get("data")
                        return [(socket.AF_INET, type if type else socket.SOCK_STREAM, proto if proto else socket.IPPROTO_TCP, '', (ip, port))]
        except Exception as e:
            print(f"DNS patch failed: {e}")
            pass
    return _orig_getaddrinfo(host, port, family, type, proto, flags)

socket.getaddrinfo = patched_getaddrinfo

try:
    print(socket.getaddrinfo("ep-quiet-water-anjrkajg-pooler.c-6.us-east-1.aws.neon.tech", 5432))
except Exception as e:
    print("Error:", e)
