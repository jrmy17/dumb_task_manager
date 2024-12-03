# Tentatives d'attaque de l'app

| Ce qui ne va pas | Pourquoi | Comment le changer |
|-|-|-|
| connexion | possibilité de se connecter aux différents compte sans passer par la page de connexion (ajout de ?userId= id de n'importe quel compte) | changer la façon de récupérer l'information de connexion |
| admin | sur la route admin non protégée | ajouter des roles pour protégé la route admin, voire changer le nom de l'url |
| admin | On peut récupérer les noms des utilisateurs dans le menu admin | trouver un moyen de cacher les noms d'utilisateur |
| connexion | si on essaye de se connecter avec le nom d'un utilisateur, on peut voir toutes ses informations dans les logs de l'application(mail et mot de passe) | retirer les consoles logs |
| ajout de task | le sql des ajouts de tasks est écrit dans le log | retirer le console log |
| ajout de task | sql injection dans le title : ', (SELECt concat( email, ', ', username, ', ', password) from users where id=1), 0, 5 ); insert into tasks (title, description, comleted, user_id) values ('. Cela te donne le mail de n'importe quel compte (en remplaçant le 1 par id de n'importe quel compte et le 5 par ton compte à toi). Possibilité de changer email par password ou username pour récupérer les informations de connexion | corriger l'ajout de task |

script et iframes ne fonctionne pas sur l'ajout de tasks
