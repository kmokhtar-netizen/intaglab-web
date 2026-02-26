// Keys for translation lookups
export const CITIES = {
    cairo: "Cairo", alexandria: "Alexandria", giza: "Giza", shubra_el_kheima: "Shubra El-Kheima", port_said: "Port Said", suez: "Suez",
    luxor: "Luxor", mansoura: "Mansoura", el_mahalla_el_kubra: "El-Mahalla El-Kubra", tanta: "Tanta", asyut: "Asyut", ismailia: "Ismailia",
    fayyum: "Fayyum", zagazig: "Zagazig", aswan: "Aswan", damietta: "Damietta", damanhur: "Damanhur", minya: "Minya", beni_suef: "Beni Suef",
    qena: "Qena", sohag: "Sohag", hurghada: "Hurghada", sixth_of_october: "6th of October", shibin_el_kom: "Shibin El Kom", banha: "Banha",
    kafr_el_sheikh: "Kafr El-Sheikh", arish: "Arish", mallawi: "Mallawi", tenth_of_ramadan: "10th of Ramadan", bilbais: "Bilbais", marsa_matruh: "Marsa Matruh",
    idfu: "Idfu", mit_ghamr: "Mit Ghamr", al_hamidiyya: "Al-Hamidiyya", desouk: "Desouk", qalyub: "Qalyub", abu_kabir: "Abu Kabir", kafr_el_dawar: "Kafr El-Dawar",
    girga: "Girga", akhmim: "Akhmim", matareya: "Matareya"
};

export const CATEGORIES = {
    textiles_garments: "Textiles & Garments",
    food_beverage: "Food & Beverage",
    construction_building: "Construction & Building Materials",
    chemicals_petrochemicals: "Chemicals & Petrochemicals",
    pharmaceuticals_medical: "Pharmaceuticals & Medical",
    metal_steel: "Metal & Steel",
    plastic_rubber: "Plastics & Rubber",
    engineering_manufacturing: "Engineering & Manufacturing",
    automotive_transportation: "Automotive & Transportation",
    electronics_appliances: "Electronics & Appliances",
    energy_renewable: "Energy & Renewable Power",
    paper_packaging: "Paper & Packaging",
    furniture_wood: "Furniture & Woodworking",
    mining_quarrying: "Mining & Quarrying",
    agriculture_farming: "Agriculture & Farming",
    other: "Other"
};

export const MANUFACTURING_SERVICES = {
    cnc_machining: "CNC Machining",
    injection_molding: "Injection Molding",
    printing_3d: "3D Printing",
    sheet_metal: "Sheet Metal Fabrication",
    casting: "Casting",
    forging: "Forging",
    welding: "Welding",
    assembly: "Assembly",
    quality_control: "Quality Control / Inspection",
    finishing: "Finishing / Surface Treatment",
    engineering_design: "Engineering & Design",
    other: "Other"
};

export const MATERIALS = {
    aluminum: "Aluminum",
    steel: "Steel",
    stainless_steel: "Stainless Steel",
    brass: "Brass",
    copper: "Copper",
    titanium: "Titanium",
    abs_plastic: "ABS Plastic",
    polycarbonate: "Polycarbonate",
    nylon: "Nylon",
    rubber: "Rubber",
    wood: "Wood",
    glass: "Glass",
    composites: "Composites"
};

// Helper for temporary backward compatibility (returning just values) if needed, 
// but we should switch to using keys.
export const EGYPT_CITIES_LIST = Object.values(CITIES).sort();
export const CATEGORIES_LIST = Object.values(CATEGORIES).sort();
export const SERVICES_LIST = Object.values(MANUFACTURING_SERVICES).sort();
export const MATERIALS_LIST = Object.values(MATERIALS).sort();

export const CATEGORY_IMAGES: Record<string, string> = {
    textiles_garments: "https://images.unsplash.com/photo-1534639074092-aa2c0ec224f3?auto=format&fit=crop&w=800&q=80",
    food_beverage: "https://images.unsplash.com/photo-1596459349887-8bc8592f801a?auto=format&fit=crop&w=800&q=80",
    construction_building: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    chemicals_petrochemicals: "https://images.unsplash.com/photo-1563823293817-497b77ab4376?auto=format&fit=crop&w=800&q=80",
    pharmaceuticals_medical: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
    metal_steel: "https://images.unsplash.com/photo-1504381384074-9b2f60a92986?auto=format&fit=crop&w=800&q=80",
    plastic_rubber: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=800&q=80",
    engineering_manufacturing: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80",
    automotive_transportation: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80",
    electronics_appliances: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    energy_renewable: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    paper_packaging: "https://images.unsplash.com/photo-1605663864774-748f5f858a08?auto=format&fit=crop&w=800&q=80",
    furniture_wood: "https://images.unsplash.com/photo-1611082348555-467406a4897c?auto=format&fit=crop&w=800&q=80",
    mining_quarrying: "https://images.unsplash.com/photo-1524514652237-773a76e0be0d?auto=format&fit=crop&w=800&q=80",
    agriculture_farming: "https://images.unsplash.com/photo-1625246333195-09d9b11d7013?auto=format&fit=crop&w=800&q=80",
    other: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
};
