export default interface IUser2FAAttribute {
  id: number;
  userId: number;
  is2FAEnabled: boolean;
  secret32: string;
}
