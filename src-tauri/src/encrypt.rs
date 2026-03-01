use argon2::{
    password_hash::{PasswordHasher, SaltString},
    Argon2,
};
use chacha20poly1305::{
    aead::{Aead, KeyInit},
    XChaCha20Poly1305, XNonce,
};
use rand::{rngs::OsRng, RngCore};

pub fn derive_key(password: &str, salt: &SaltString) -> [u8; 32] {
    let argon2 = Argon2::default(); // Argon2id, safe defaults

    let mut key = [0u8; 32];
    argon2
        .hash_password_into(password.as_bytes(), salt.as_bytes(), &mut key)
        .expect("argon2 failed");

    key
}

pub fn encrypt(key: &[u8; 32], plaintext: &[u8]) -> Vec<u8> {
    let cipher = XChaCha20Poly1305::new(key.into());

    let mut nonce_bytes = [0u8; 24];
    rand::thread_rng().fill_bytes(&mut nonce_bytes);
    let nonce = XNonce::from_slice(&nonce_bytes);

    let ciphertext = cipher.encrypt(nonce, plaintext).expect("encryption failed");

    // Store nonce + ciphertext together
    [nonce_bytes.to_vec(), ciphertext].concat()
}

pub fn decrypt(key: &[u8; 32], data: &[u8]) -> Result<Vec<u8>, ()> {
    if data.len() < 24 {
        return Err(());
    }

    let (nonce_bytes, ciphertext) = data.split_at(24);

    let cipher = XChaCha20Poly1305::new(key.into());
    let nonce = XNonce::from_slice(nonce_bytes);

    cipher.decrypt(nonce, ciphertext).map_err(|_| ())
}

pub fn get_salt() -> Result<Vec<u8>, ()> {
    SaltString::generate(&mut OsRng)
}

pub fn enc() {
    let password = "correct horse battery staple";

    // One-time setup
    let salt = SaltString::generate(&mut rand::rngs::OsRng);
    let key = derive_key(password, &salt);

    let secret_data = b"super secret user data";

    let encrypted = encrypt(&key, secret_data);
    let decrypted = decrypt(&key, &encrypted).unwrap();

    assert_eq!(secret_data.to_vec(), decrypted);
}
