function validarLogin(email, senha){

   if(!email || !senha){
      return "Campos obrigatórios";
   }

   return "Login válido";
}

module.exports = validarLogin;