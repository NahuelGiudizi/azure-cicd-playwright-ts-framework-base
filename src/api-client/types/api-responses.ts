// Common API response types
export interface BaseApiResponse {
  responseCode: number;
  message: string;
}

export interface LoginResponse extends BaseApiResponse {
  message: 'User exists!' | 'User not found!';
}

export interface CreateAccountResponse extends BaseApiResponse {
  message: 'User created!' | 'Email already exists!';
}

export interface DeleteAccountResponse extends BaseApiResponse {
  message: 'Account deleted!';
}

export interface UpdateAccountResponse extends BaseApiResponse {
  message: 'User updated!';
}

export interface GetUserResponse extends BaseApiResponse {
  user: {
    id: number;
    name: string;
    email: string;
    title: string;
    birth_day: string;
    birth_month: string;
    birth_year: string;
    first_name: string;
    last_name: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
  };
}

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: {
      usertype: string;
    };
    category: string;
  };
}

export interface ProductsResponse extends BaseApiResponse {
  products: Product[];
}

export interface Brand {
  id: number;
  brand: string;
}

export interface BrandsResponse extends BaseApiResponse {
  brands: Brand[];
}

export interface SearchProductsResponse extends BaseApiResponse {
  products: Product[];
}

export interface ErrorResponse extends BaseApiResponse {
  message: string;
}
