# Cyblime Cycling Club - Django Web Application

A comprehensive Django web application for Brooklyn's premier cycling community, featuring an animated landing page, community blog, event management, photo gallery, and integrations with Strava and an online store.

## 🚴‍♂️ Features

### Core Features
- **Animated Landing Page**: Bold hero section with parallax effects and cycling animations
- **User Authentication**: Registration, login, logout, and profile management
- **Responsive Design**: Fully responsive across all devices using TailwindCSS

### Community Features
- **Blog System**: 
  - Users can create, edit, and delete their own posts
  - Like/dislike system with AJAX
  - Comment system
  - Instagram-style user profiles with "My Posts" feed
- **Event Management**: 
  - Staff-only CRUD for cycling events
  - Public event listing and detail views
- **Articles**: 
  - Admin/staff-only content publishing
  - Public read-only access
- **Photo Gallery**: 
  - Admin/staff photo uploads
  - Public gallery viewing

### External Integrations
- **Strava Integration**: Embedded club widgets and activity feeds
- **Online Store**: Embedded store from volver.com
- **Social Media Ready**: Font Awesome icons and social links

## 🛠️ Technology Stack

- **Backend**: Django 5.2.6
- **Frontend**: TailwindCSS (CDN), HTML5, JavaScript
- **Database**: SQLite (development) - easily configurable for PostgreSQL/MySQL
- **Images**: Pillow for image handling
- **Forms**: Django Crispy Forms with Tailwind integration

## 📋 Installation & Setup

### Prerequisites
- Python 3.8+
- pip
- Git

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cyblime-cycling
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install django pillow django-crispy-forms crispy-tailwind
   ```

4. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

7. **Access the application:**
   - Main site: http://localhost:8000
   - Admin panel: http://localhost:8000/admin

## 🏗️ Project Structure

```
cyblime_cycling/
├── cyblime_cycling/          # Main project settings
├── core/                     # Home and about pages
├── users/                    # Custom user model and authentication
├── blog/                     # Community blog functionality
├── events/                   # Event management
├── articles/                 # Staff-published articles
├── gallery/                  # Photo gallery
├── store/                    # Store page with volver.com embed
├── strava/                   # Strava integration page
├── templates/                # HTML templates
├── static/                   # CSS, JS, and static assets
├── media/                    # User-uploaded files
└── manage.py                 # Django management script
```

## 👥 User Roles & Permissions

### Regular Users
- Register and manage their profile
- Create, edit, and delete their own blog posts
- Like/dislike and comment on posts
- View all public content (events, articles, gallery)

### Staff/Admin
- All regular user permissions
- Create, edit, and delete any blog posts
- Manage events (CRUD)
- Publish articles
- Upload and manage gallery photos
- Access Django admin panel

## 🎨 Design Features

### Color Scheme
- **Primary Blue**: #1e40af (cyblime-blue)
- **Primary Green**: #10b981 (cyblime-green)
- **Dark**: #111827 (cyblime-dark)

### Animations
- Rotating bicycle icon on homepage
- Fade-in and slide-up animations
- Hover effects and transforms
- Animated background elements

### Responsive Design
- Mobile-first approach
- Collapsible navigation menu
- Responsive grid layouts
- Touch-friendly interface

## 🔧 Configuration

### Environment Variables (Production)
Create a `.env` file for production settings:

```env
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=your-database-url
```

### External Integrations
1. **Strava**: Replace placeholder URLs in `templates/strava/strava.html` with your actual Strava club ID
2. **Store**: Update the volver.com URL in `templates/store/store.html` with your store link
3. **Media Storage**: Configure cloud storage for production (AWS S3, etc.)

## 🚀 Deployment

### Production Checklist
- [ ] Set DEBUG=False
- [ ] Configure production database
- [ ] Set up static file serving
- [ ] Configure media file storage
- [ ] Set up HTTPS
- [ ] Configure email backend
- [ ] Update ALLOWED_HOSTS

### Recommended Deployment Options
- **Heroku**: Easy deployment with PostgreSQL addon
- **DigitalOcean**: App Platform or Droplets
- **AWS**: EC2 with RDS
- **Vercel/Netlify**: For static deployments (requires modifications)

## 📱 API Endpoints

The application includes AJAX endpoints for:
- `/blog/<id>/like/` - Like/dislike posts
- `/blog/<id>/comment/` - Add comments
- `/blog/comment/<id>/delete/` - Delete comments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🛟 Support

For support and questions:
- Email: hello@cyblimecycling.com
- GitHub Issues: [Create an issue](repository-issues-url)

## 🎯 Future Enhancements

- [ ] Real-time chat system
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced Strava integration with OAuth
- [ ] Email newsletters
- [ ] Ride tracking and GPS integration
- [ ] Marketplace for bike gear trading
- [ ] Event RSVP system
- [ ] Push notifications

---

**Built with ❤️ for the cycling community in Brooklyn, NY**# Cyblime-Cycling_BK
# Cyblime-Cycling_BK
# Cyblime-Cycling_BK
# Cyblime-Cycling_BK
# Cyblime-Cycling_BK
# Cyblime-Cycling_BK
# Cyblime-Cycling_BK
