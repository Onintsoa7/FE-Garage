export class Constants{
  public static BASE_URL = 'http://localhost:5000/';
  // public static BASE_URL = 'https://m1p12mean-1767-1905.onrender.com/';

  public static USERS_API = this.BASE_URL + 'users';
  public static LOGIN_API = this.BASE_URL + 'users/login';
  public static SIGNUP_API = this.BASE_URL + 'users/register';

  public static PIECE_API = this.BASE_URL + 'pieces';
  public static SERVICE_API = this.BASE_URL + 'services';
  public static TYPE_SERVICE_API = this.BASE_URL + 'type-services';
  public static VOITURE_API = this.BASE_URL + 'voitures';
  public static FACTURE_API = this.BASE_URL + 'factures';
}
