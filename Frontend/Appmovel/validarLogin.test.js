const validarLogin = require("./validarLogin");

test("Login com campos vazios",()=>{

   expect(
      validarLogin("","")
   ).toBe("Campos obrigatórios");

});

test("Login preenchido",()=>{

   expect(
      validarLogin(
         "joao@gmail.com",
         "1234"
      )
   ).toBe("Login válido");

});

test("Senha vazia",()=>{

   expect(
      validarLogin(
         "joao@gmail.com",
         ""
      )
   ).toBe("Campos obrigatórios");

});