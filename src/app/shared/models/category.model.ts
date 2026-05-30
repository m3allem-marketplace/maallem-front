export interface Category {
  id:             string;
  name:           string;
  icon:           string;
  subcategories:  Category[];
}