import CategorieStock  from "../../models/CategorieStock.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategorieStock.findAll();
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCategorie = async (req, res) => {
    try {
        const { nom, description } = req.body;
        const categorie = await CategorieStock.create({ nom, description });
        res.status(201).json({ success: true, data: categorie });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateCategorie = async (req, res) => {
    try {
      const [updated] = await CategorieStock.update(req.body, {
        where: { id: req.params.id }
      });
      if (!updated) return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });
      const categorie = await CategorieStock.findByPk(req.params.id);
      res.json({ success: true, data: categorie });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  export const deleteCategorie = async (req, res) => {
    try {
      const deleted = await CategorieStock.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) return res.status(404).json({ success: false, message: 'Catégorie non trouvée' });
      res.json({ success: true, message: 'Catégorie supprimée' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };