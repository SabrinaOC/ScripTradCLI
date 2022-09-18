# Aplicación web híbrida de asistencia a la traducción
<p>Aplicación web desarrollada con Ionic, un framework gratuito y open source para desarrollar aplicaciones híbridas multiplataforma 
que utiliza HTML5, CSS (generado por SASS) y Cordova como base.</p>
<p>Este proyecto surge del deseo de aunar mis dos mundos o pasiones, la programación y la traducción; y con el objeto de dar respuesta 
a las necesidades del traductor para el desempeño de su trabajo.</p>
<p>La idea general era crear una aplicación que hiciera las veces de herramienta de gesión a la par que de traducción y, por ello,
está enfocada en dos perfiles principales, gestor de proyecto y traductor, cada uno de los cuales tendrá unas funcionalidades específicas.</p>


## LOGIN
* Página de inicio de inicio de sesión (con opción de Google login y sign in) compartida para traductores y gestores. Como se trata de una app multiplataforma, 
contamos con vistas tanto para navegador como para Android e iOS.
<p align="center">
  <img width="630" src="./img/inicioWeb.PNG"/>
</p>
<p align="center">
  <img width="330" src="./img/inicioMobile.PNG"/>
</p>


## REGISTRO
* Vista de registro si es la primera vez que se accede a la app. 
Si se prefiere hacer mediante Google se realizará un registro en dos pasos para completar el perfil del usuario.
<p align="center">
  <img width="630" src="./img/registerWeb.PNG"/>
</p>
<p align="center">
  <img width="330" src="./img/registerMobile.PNG"/>
</p>


## GESTOR
### INICIO GESTOR
* Página de inicio para usuario con rol gestor. Historial de proyectos del usuario y opciones para desplegar un menú
o crear nuevos proyectos.
<p align="center">
  <img width="330" src="./img/homeGestor.PNG"/>
</p>

### CREAR PROYECTO
* Vista para crear nuevos proyectos de traducción y asignarlos a los traductores disponibles en BBDD.
<p align="center">
  <img width="330" src="./img/createProjectGestor.PNG"/>
</p>

## TRADUCTOR
### INICIO TRADUCTOR
* Página de inicio para traductores. Historial de proyectos del usuario y opciones para desplegar un menú
o acceder a la vista propia de traducción para la realización del trabajo.
<p align="center">
  <img width="330" src="./img/homeTraductor.PNG"/>
</p>

### TRADUCCIÓN
Vista para crear desarrollar el trabajo de traducción. Destaca:
* Una barra de progreso en la parte superior para
que de golpe de vista se pueda ver en qué punto del proceso se encuentra.
* Segmentación del texto para agilizar el proceso.
* Posibilidad de solicitar una traducción automática editable.
* Glosario propio asociado al proyecto.
* Sección para comentarios. Un espacio para que el traductor pueda comunicar sus decisiones traductologicas o aspectos relevantes que considere necesario.
<p align="center">
  <img width="330" src="./img/translationSegments.PNG"/>
</p>

<p align="center">
  <img width="330" src="./img/translation.PNG"/>
</p>

## MENÚ
* Menú compartido para ambos roles desde donde se puede editar los datos de perfil o cambiar las contraseñas de acceso.
<p align="center">
  <img width="330" src="./img/menuOptions.PNG"/>
</p>

## PERFIL
* Vista para editar los datos del usuario (nombre, nombre de usuario, imagen...).
<p align="center">
  <img width="330" src="./img/profileEditor.PNG"/>
</p>

## PASSWORD
* Página que permite cambiar la contraseña, en dos pasos, primero corroborando que la contraseña actual indicada es correcta y 
después comprobando que la confirmación de la nueva contraseña es correcta para evitar errores de typo.
<p align="center">
  <img width="330" src="./img/passwordChange.PNG"/>
</p>

