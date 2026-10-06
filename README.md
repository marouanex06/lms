# Learning Management System (LMS)

Système de gestion de l’apprentissage permettant d’organiser les cours, les leçons, les inscriptions et le suivi de la progression des étudiants.

## Présentation

Ce projet suit une architecture frontend/backend séparée et constitue la base d’une plateforme d’apprentissage en ligne.

## Fonctionnalités

- Gestion des cours et des leçons
- Gestion des inscriptions des étudiants
- Suivi de la progression des étudiants
- Gestion des utilisateurs
- Intégration avec une API backend
- Application connectée à une base de données
- Séparation du frontend et du backend

## Architecture

```
lms/
├── frontend/   # Application côté client
└── backend/    # Backend Laravel/PHP
```

## Technologies utilisées

- JavaScript
- React
- PHP
- Laravel
- MySQL
- Vite
- API REST
- Git / GitHub

## Installation

### Backend

```bash
cd backend
composer install
php artisan migrate
php artisan serve
```

### Frontend

Consulter les instructions du dossier `frontend/` puis lancer le serveur de développement depuis ce dossier.

> **Remarque :** configurer les variables d’environnement et les identifiants de la base de données avant de lancer l’application.

## Auteur

**Marouane El Khayati**  
Développeur Web Full Stack

[GitHub](https://github.com/marouanex06)
