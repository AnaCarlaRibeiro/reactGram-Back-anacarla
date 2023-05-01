const { body } = require("express-validator");





const photoInsertValidation = () => {


  return [
    (req, res, next) => {
      console.log("Valor do campo 'title': ", req.body.title); // adiciona console.log para o campo 'title'
      next();
    },
    body("title")
    .not()
    .equals("undefined")
    .withMessage("O título é obrigatório")
    .isString()
    .withMessage("O título precisa ser uma string")
    .isLength({ min: 3 })
    .withMessage("O nome precisa ter no mínimo 3 caracteres."),
    body("image").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("A imagem é obrigatória");
      }
      return true;
    }),

  
  ];
};


module.exports={
    photoInsertValidation,
}
