export class TokenManager {
  public static token: string = "";

  public static setToken(token: string): void {
    localStorage.setItem("token", token);
    TokenManager.token = token;
  }

  public static loadToken(): void {
    const token = localStorage.getItem("token");
    if (token) TokenManager.token = token;
  }

  public static deleteToken(): void {
    localStorage.removeItem("token");
    TokenManager.token = "";
  }
}
