export class Product {
    id_product: number = 0;
    name_product: string = '';
    price: number = 0;
    description: string = '';
    brand: string = '';
    id_rating: number = 0;
    quantity: number = 0;  
    expirydate: string = '';
    thumbnail: string = '';
    id_agency: number = 0;
    url_image: string = '';
}

export class ProductPagination
{
    length: number = 0;
    size: number = 0;
    page: number = 0;
    lastPage: number = 0;
    startIndex: number = 0;
    endIndex: number = 0;
}