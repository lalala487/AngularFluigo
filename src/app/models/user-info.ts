export interface UserInfo {
    name: {
        first: string;
        last: string;
    };
    contact: {
        email: string;
        phone: {
            home: string;
        }
    };
    email: string;
    stripeCustomerId: string;
    uid: string;
}
