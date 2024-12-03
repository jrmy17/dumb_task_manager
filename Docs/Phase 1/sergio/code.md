# Code

| Ce qui ne va pas | Pourquoi | Comment le changer |
|-|-|-|
|modele sql| quelques codes dans les models doivent être sécurisée | ne pas mettre les parametres directement dans le sql amis en parametres |
| admin | route admin doit être sécurisé | ajouter des roles et sécuriser
| class user | user ne doit pas forcement être une class pour éviter de récupérer toutes les infos d'un coup. |
| création de compte | user/register ne devrait pas renvoyer sur la home si le compte n'est pas créé.| modifier les conditions de créations

