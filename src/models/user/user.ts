// src/models/user/user.ts

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    title: 'Mr' | 'Mrs' | 'Miss';
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface UserProfile {
    personalInfo: {
        title: string;
        firstName: string;
        lastName: string;
        email: string;
        dateOfBirth: {
            day: string;
            month: string;
            year: string;
        };
        company?: string;
        mobileNumber: string;
    };
    address: {
        address1: string;
        address2?: string;
        country: string;
        state: string;
        city: string;
        zipcode: string;
    };
}

export interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}



