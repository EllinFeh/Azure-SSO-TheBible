import os
from flask import Flask, redirect, url_for, session, request, jsonify
from flask_cors import CORS  # Certifique-se de importar CORS
from msal import ConfidentialClientApplication
from dotenv import load_dotenv

# Carregar variáveis do .env
load_dotenv()

app = Flask(__name__)  # Inicializa o Flask
CORS(app)  # Habilita CORS após a inicialização do app

app.secret_key = os.urandom(24)  # Chave aleatória para a sessão

# Configurações do Azure AD
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
TENANT_ID = os.getenv("TENANT_ID")
AUTHORITY = f"https://login.microsoftonline.com/{TENANT_ID}"
REDIRECT_URI = os.getenv("REDIRECT_URI")
SCOPES = []  # Sem escopos reservados

# Criar instância da MSAL
msal_app = ConfidentialClientApplication(CLIENT_ID, CLIENT_SECRET, authority=AUTHORITY)


@app.route("/user")
def get_user():
    """Retorna os dados do usuário logado"""
    if "user" in session:
        return jsonify(session["user"])
    return jsonify({"error": "Usuário não autenticado"}), 401

@app.route("/login")
def login():
    """Redireciona para o login no Azure"""
    auth_url = msal_app.get_authorization_request_url(SCOPES, redirect_uri=REDIRECT_URI)
    return redirect(auth_url)

@app.route("/auth/redirect")
def auth_redirect():
    """Callback do Azure AD após o login"""
    if "error" in request.args:
        return f"Erro ao autenticar: {request.args['error_description']}"

    if "code" in request.args:
        code = request.args["code"]
        result = msal_app.acquire_token_by_authorization_code(code, SCOPES, redirect_uri=REDIRECT_URI)

        if "id_token_claims" in result:
            user_info = result["id_token_claims"]
            session["user"] = {
                "name": user_info.get("name", ""),
                "email": user_info.get("preferred_username", ""),
                "domain": user_info.get("preferred_username", "").split("@")[-1] if "preferred_username" in user_info else ""
            }

            # # Verificar domínio do usuário
            # allowed_domain = "seu-dominio.com"  # Substitua pelo domínio da empresa
            # if session["user"]["domain"] != allowed_domain:
            #     session.clear()
            #     return "Acesso negado. Apenas usuários da empresa podem entrar."

            return redirect("http://localhost:3000/homepage")  # Redireciona para o frontend

        return f"Erro ao adquirir token: {result.get('error_description')}"

    return "Código de autenticação não encontrado."

@app.route("/logout")
def logout():
    """Limpa a sessão e desloga do Azure"""
    session.clear()
    logout_url = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/logout"
    return redirect(logout_url + "?post_logout_redirect_uri=http://localhost:3000")

if __name__ == "__main__":
    app.run(debug=True)
