# Observations

| Ce qui ne va pas | Pourquoi | Comment le changer |
|-|-|-|
| la couleur du bg | trop agressif pour les yeux | Définir les couleurs de l'application |
| menu | n'existe pas et besoin de lien pour naviguer entre les pages | Ajouter un menu |
| apparence de l'application | aucun style | styliser l'application
| mot de passe à la création de compte | on voit le mot de passe en clair | ajouter le type password à l'input |
| les champs de création de compte | aucunes conditions |ajouter des conditions sur les inputs |
| déconnexion | aucun liens | Ajouter un lien de déconnexion |
| couleur de task | horrible | revoir les couleurs de l'application |
| ajout de task | possibilite d'ajouter une task vide | ajouter des conditions au formulaire |
| task completed | aucunes différence entre une task completed ou non completed visuellement | ajouter une différence visuel |
| modifier une task | impossible de completer une task déjà créée | ajouter un bouton ou quelques chose sur la task |
| la connexion | on reconnait la connexion avec l'userId donnée dans l'url | il faudrait gérer les pages avec la sessions et non l'userId donnée en url |
| connexion | se connecter avec un compte non existant fait planter l'app | vérifier l'existant du compte avant de récupérer le mot de passe |
| création de comtpe | si on essaye de creer un compte avec un mail déjà utilisé, le compte ne se crée pas mais on a pas d'erreur | il faudrait faire apparaitre une erreur et non rediriger sur la page de connexion |
| mail lors de la création | on récupère le mail sans respecter le GRPD et on ne l'utilise pas | On peut rajouter un lien de mot de passe oublié et/ou une double authentification et il faut ajouter un case a cocher indiquand pourquoi on récupérere le mail |
| affichage des tasks | page peut devenir infiniment longue | faire une pagination |
| création de task | le séparer de la liste des tasks | possibilité de faire le formulaire de création dans une pop up qui apparait apres avoir cliquer sur un bouton ou une page différente, ajouter une dateline aux tasks ? |
| liste des tasks | impossible de les modifiers | ajouter la possibilité de les modifier, ajouter un ordre ou prioriser des tasks, separer les tasks par categories ? |
| suppression de task | aucun traces lorsqu'on supprime | il vaut peut etre mieux archiver les tasks que les supprimer pour garder une trace, la checkbox terminé deviendrait archiver, enregistrer la date d'archive aussi pour savoir quand la task a été complété |
| admin | supression des comptes ne fonctionne pas | ajouter la route de suppression