export interface User {
  _id?: string;
  nom: string;
  adresseMail: string;
  numeroTel: string;
  password: string;
  role: 'ADMIN' | 'CLIENT' | 'MECANICIEN';
  photo?: string;
  adresse: string;
  CIN: string;
  dateDeNaissance: Date;
}
export interface UserLogin {
  adresseMail: string;
  password: string;
}
