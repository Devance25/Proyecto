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
    public String $nombreUsuario;
    public String $email;
    public String $nacimiento;
    public String $password;
    public String $admin;

    public function __construct(array $data){
        $this->nombreUsuario = trim((String)($data['nombreUsuario'] ?? ''));
        $this->email = trim((String)($data['email'] ?? ''));
        $this->nacimiento = trim(($data['nacimiento'] ?? ''));
        $this->password = trim((String)($data['password'] ?? ''));
        $this->admin = trim((String)($data['admin'] ?? ''));
    }
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
    public String $id;
    public String $nombreUsuario;
    public String $email;
    public String $nacimiento;
    public String $admin;

    public function __construct(array $row){
        $this->id = trim((String)($row['id'] ?? ''));
        $this->nombreUsuario = trim((String)($row['nombre_usuario'] ?? ''));
        $this->email = trim((String)($row['email'] ?? ''));
        $this->nacimiento = trim((String)($row['nacimiento'] ?? ''));
        $this->admin = trim((String)($row['admin'] ?? ''));
    }
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