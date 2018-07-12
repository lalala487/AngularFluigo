export interface Deal {
    active: boolean;
    name: object;
    description: object;
    slug: string;
    merchant: any;
    city: any;
    accommodation: any;
    startDate: Date;
    endDate: Date;
    flights: any;
    activities: any;
    marketingPrice: number;
    marketingDiscount: number;
    availableServices: object;
    rating: number;
}
