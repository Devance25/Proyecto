<?php

class Reglas{


//     Bosque: Indica que el dinosaurio debe colocarse en una zona de bosque. 
//     Roca: Señala que el dinosaurio debe ir a una zona de pradera o llanura. 
//     baño: Indica que el dinosaurio se debe colocar en una zona de "aseos" (lado 
//           derecho del río)
//     Cafeteria: Indica que el dinosaurio se debe colocar en una zona del lado 
//           izquierdo del río. 
//     Vacío: Un símbolo de una huella de dinosaurio en un recinto vacío significa 
//           que se debe colocar el dinosaurio en un recinto que no tenga
//           dinosaurios. 
//     No T-Rex: Un T-Rex sobre un símbolo de peligro indica que el dinosaurio no 
//           puede colocarse en un recinto que ya contenga un T-Rex. 







    public function restriccionDado(int $caraDado): array
    {
        
    }


// Reglas de puntuación de los recintos:

// bosque-semejanza : Puntos según el número de dinosaurios del mismo color colocados, a menudo por un espacio en el que solo se pueden colocar de un color. 

// rey-jungla: Obtienes 7 puntos si el dinosaurio es único de su especie en tu zoológico, en comparación con otros dinosaurios de esa especie. 

// woody-trio: Se pueden colocar hasta tres dinosaurios de cualquier especie y puntúan según las reglas específicas de ese recinto. 

// pradera-amor: Puedes colocar hasta dos dinosaurios de cada especie, y cada pareja de la misma especie vale 5 puntos. 

// isla-solitaria: Puedes colocar solo un dinosaurio. 

// rio: Cada dinosaurio en el río vale un punto. 

// prado-diferencia

// Puntos adicionales por T-Rex: Cada recinto que contenga un T-Rex, aunque tenga más de uno, otorga 1 punto de victoria adicional. 

    public function reglasBosque($dinos): int
    {

    }

}