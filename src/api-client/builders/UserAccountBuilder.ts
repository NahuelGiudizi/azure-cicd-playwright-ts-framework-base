// src/api-client/builders/UserAccountBuilder.ts
import { CreateAccountRequest, UpdateAccountRequest } from '../controllers/UserController';

/**
 * Builder para crear solicitudes de cuenta de usuario
 * Implementa el patrón Builder para simplificar la construcción de objetos complejos
 */
export class UserAccountBuilder {
    private userData: Partial<CreateAccountRequest> = {};

    /**
     * Establece el nombre completo del usuario
     */
    withName(name: string): this {
        this.userData.name = name;
        return this;
    }

    /**
     * Establece el email del usuario
     */
    withEmail(email: string): this {
        this.userData.email = email;
        return this;
    }

    /**
     * Establece la contraseña del usuario
     */
    withPassword(password: string): this {
        this.userData.password = password;
        return this;
    }

    /**
     * Establece el título del usuario (Mr, Mrs, Miss)
     */
    withTitle(title: 'Mr' | 'Mrs' | 'Miss'): this {
        this.userData.title = title;
        return this;
    }

    /**
     * Establece la fecha de nacimiento del usuario
     */
    withBirthDate(day: string, month: string, year: string): this {
        this.userData.birth_date = day;
        this.userData.birth_month = month;
        this.userData.birth_year = year;
        return this;
    }

    /**
     * Establece el nombre y apellido del usuario
     */
    withFullName(firstname: string, lastname: string): this {
        this.userData.firstname = firstname;
        this.userData.lastname = lastname;
        return this;
    }

    /**
     * Establece la empresa del usuario (opcional)
     */
    withCompany(company: string): this {
        this.userData.company = company;
        return this;
    }

    /**
     * Establece la dirección principal del usuario
     */
    withAddress(address1: string, address2?: string): this {
        this.userData.address1 = address1;
        if (address2) {
            this.userData.address2 = address2;
        }
        return this;
    }

    /**
     * Establece la información de ubicación del usuario
     */
    withLocation(country: string, state: string, city: string, zipcode: string): this {
        this.userData.country = country;
        this.userData.state = state;
        this.userData.city = city;
        this.userData.zipcode = zipcode;
        return this;
    }

    /**
     * Establece el número de teléfono móvil del usuario
     */
    withMobileNumber(mobileNumber: string): this {
        this.userData.mobile_number = mobileNumber;
        return this;
    }

    /**
     * Construye el objeto CreateAccountRequest
     */
    build(): CreateAccountRequest {
        this.validateRequiredFields();
        return this.userData as CreateAccountRequest;
    }

    /**
     * Construye el objeto UpdateAccountRequest
     */
    buildForUpdate(): UpdateAccountRequest {
        this.validateRequiredFields();
        return this.userData as UpdateAccountRequest;
    }

    /**
     * Valida que todos los campos requeridos estén presentes
     */
    private validateRequiredFields(): void {
        const requiredFields: (keyof CreateAccountRequest)[] = [
            'name', 'email', 'password', 'title', 'birth_date', 'birth_month', 'birth_year',
            'firstname', 'lastname', 'address1', 'country', 'zipcode', 'state', 'city', 'mobile_number'
        ];

        const missingFields = requiredFields.filter(field => !this.userData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
    }

    /**
     * Resetea el builder para construir un nuevo usuario
     */
    reset(): this {
        this.userData = {};
        return this;
    }

    /**
     * Crea un builder con datos de usuario de prueba por defecto
     */
    static createTestUser(): UserAccountBuilder {
        return new UserAccountBuilder()
            .withName('Test User')
            .withEmail(`test.user.${Date.now()}@example.com`)
            .withPassword('testpassword123')
            .withTitle('Mr')
            .withBirthDate('15', 'January', '1990')
            .withFullName('Test', 'User')
            .withCompany('Test Company Inc.')
            .withAddress('123 Test Street', 'Apt 4B')
            .withLocation('United States', 'California', 'Test City', '12345')
            .withMobileNumber('+1234567890');
    }

    /**
     * Crea un builder con datos mínimos requeridos
     */
    static createMinimalUser(email: string, password: string): UserAccountBuilder {
        return new UserAccountBuilder()
            .withEmail(email)
            .withPassword(password)
            .withName('Minimal User')
            .withTitle('Mr')
            .withBirthDate('01', 'January', '1990')
            .withFullName('Minimal', 'User')
            .withAddress('123 Main St')
            .withLocation('United States', 'CA', 'City', '12345')
            .withMobileNumber('+1234567890');
    }
}
