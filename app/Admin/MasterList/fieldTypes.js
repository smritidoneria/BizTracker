// fieldTypes.js

const fieldTypes = {
    customers: {
        name: 'string',
        
        phone_number: 'number',
        email_id: 'string',
        address_type: 'string',
        mailing_name: 'string',
        godown_name: 'string',
        address: 'string',
        alternate_address_1: 'string',
        alternate_address_2: 'string',
        city: 'string',
        state: 'string',
        country: 'string',
        gstin: 'string',
        payment_terms: 'string',
        supplier_item_name:'string'

    },
    items: {
     
  
        internal_item_name: 'string',
        item_description: 'string',
        uom: 'string',
        rate: 'number',
        avg_weight_needed: 'boolean',
        avg_weight: 'number',
        type: 'enum',
       
        max_buffer: 'number',
        min_buffer: 'number',
        tax_1: 'number',
        tax_2: 'number',
        drawing_revision_number: 'number',
        drawing_revision_date: 'date',
        alternate_name: 'string',
        shopfloor_alternate_name: 'string',
        scrap_type: 'string',
  
    
    },
    locations: {
       
        factory_id: 'number',
        name: 'string',
        type: 'enum', // This will depend on how 
    },
    suppliers: {
       
        name: 'string',
        poc_name: 'string',
        phone_number: 'number',
        email_id: 'string',
        address_type: 'string',
        mailing_name: 'string',
        address: 'string',
        city: 'string',
        state: 'string',
        country: 'string',
        gstin: 'string',
        payment_terms: 'string',
     
    },
    vendors: {
        
        type: 'string', // ENUM('internal', 'external') can be validated as a string with specific values
        name: 'string',
        address: 'string',
        state: 'string',
        country: 'string',
        gstin: 'string',
        
    },
    processSteps: {
       
        process_id: 'number',
        item_id: 'number',
        sequence: 'number',
        conversion_ratio: 'decimal',
        
    },
    // Add other categories and their fields
};

export default fieldTypes;
