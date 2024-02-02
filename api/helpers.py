from hashlib import sha256


def generate_hash(st):
    return sha256(st.encode('utf-8')).hexdigest()