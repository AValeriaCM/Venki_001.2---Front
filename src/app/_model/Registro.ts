export class Registro {
    name: string;
    email: string;
    lastname: string;
    address: string;
    password: string;
    passwordconfirmation: string;
    birthday: string;
    phone: string;
    description: string;
    institution: string;
    city: string;
    register_social: boolean;
    constructor() {
        this.register_social = true;
    }
}
