<?php
/*============================================================================================================*/
class RegistroDTO{
    public String $nombreUsuario;
    public String $email;
    public String $nacimiento;
    public String $password;
    public String $passwordConfirm;

    public function __construct(array $data){

        //Construye el objeto y sanitiza/normaliza datos (trim para quitar espacios a los extremos)
        $this->nombreUsuario = trim((String)($data['nombreUsuario'] ?? ''));
        $this->email = trim((String)($data['email'] ?? ''));
        $this->nacimiento = trim(($data['nacimiento'] ?? ''));
        $this->password = trim((String)($data['password'] ?? ''));
        $this->passwordConfirm = trim((String)($data['passwordConfirm'] ?? ''));

    }
}   
/*============================================================================================================*/

/*============================================================================================================*/
class RegistroAdminDTO{

}
/*============================================================================================================*/

/*============================================================================================================*/
class LoginDTO{
    public String $identificador;
    public String $email;
    public String $nombreUsuario;
    public String $password;

    public function __construct(array $data){

        $this->identificador = trim((String)($data['identificador'] ?? ($data['email'] ?? ($data['nombreUsuario'] ?? null))));
        $this->email = trim((String)($data['email'] ?? ''));
        $this->nombreUsuario = trim((String)($data['nombreUsuario'] ?? ''));
        $this->password = trim((String)($data['password'] ?? ''));
    }
}
/*============================================================================================================*/

/*============================================================================================================*/
class GetUsuariosDTO{

}
/*============================================================================================================*/

/*============================================================================================================*/
class ModificaUsuarioDTO{

}
/*============================================================================================================*/

/*============================================================================================================*/
class EliminaUsuarioDTO{

}
/*============================================================================================================*/
?>