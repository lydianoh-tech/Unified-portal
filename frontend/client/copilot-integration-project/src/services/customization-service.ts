export class CustomizationService {
    private customizations: Customization[];

    constructor() {
        this.customizations = [];
    }

    public createCustomization(customization: Customization): void {
        this.customizations.push(customization);
        // Logic to save the customization to a file or database can be added here
    }

    public updateCustomization(id: string, updatedCustomization: Customization): void {
        const index = this.customizations.findIndex(c => c.id === id);
        if (index !== -1) {
            this.customizations[index] = updatedCustomization;
            // Logic to update the customization in a file or database can be added here
        }
    }

    public getCustomizations(): Customization[] {
        return this.customizations;
    }
}