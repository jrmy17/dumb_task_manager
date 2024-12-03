### 1.2 - Tentative d'attaque de l'app individuel

| Type d'attaque testé | Emplacement | Brèche                                         | Piste d'amélioration                                                                                                   |
| -------------------- | ----------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Force Brut           | Login       | Il n'y a pas de limite au nombre de tentatives | - Ajouter des délais entre chaque tentative<br>- Ajouter des limites de connexion<br>- Ajouter des limites de requêtes<br>- Ajouter des conditions sur les mot de passe |
| Lecture des logs           | Login, dashboard       | - On peut voir toutes les données d'un utilisateur lors d'une tentative de connexion<br> - On peut voir l'appel SQL | - Retirer les console.log()
| Injection SQL           | Dashboard       | Possibilité de récupérer des données dans l'ajout de tâche | - Préparé les requêtes SQL et ne pas mettre les paramètres direction dans la requête
| Page non sécurisée           | Admin       | Tout le monde peut accéder la page | - Ajouter des rôles aux administrateurs et sécuriser la page
| Impersonation           | Dashboard       | On peut se connecter en tant qu'un autre utilisateur | - Utiliser la session correctement et non avec un query userId