import Complaint from '../models/complaint.model.js';
import dotenv from 'dotenv';

dotenv.config();

// פונקציה ליצירת תלונה חדשה
export const submitComplaint = async (req, res) => {
    try {
        const { category, message } = req.body;
        const complaint = await Complaint.create({ category, message });
        console.log(`New complaint received: ${complaint._id}`);
        // נותבים חזרה לדף הבית עם הודעת הצלחה
        res.status(201).send(`
            <!DOCTYPE html>
            <html lang="he" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>התלונה נשלחה</title>
                <link rel="stylesheet" href="style.css">
                <style>
                    .success-message {
                        color: #1a6d0c;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="success-message">התלונה התקבלה בהצלחה!</h1>
                    <p class="description">תודה שפנית. אנחנו מבטיחים להתעלם מזה במלוא הרצינות.</p>
                    <a href="/" class="button primary">חזרה לדף הבית</a>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error submitting complaint:', error.message);
        res.status(400).send(`
            <!DOCTYPE html>
            <html lang="he" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>שגיאה</title>
                <link rel="stylesheet" href="style.css">
                <style>
                    .error-message {
                        color: #d32f2f;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="error-message">שגיאה בשליחת התלונה</h1>
                    <p class="description">אנא ודאו שכל השדות מלאים. <br> הפרטים הטכניים: ${error.message}</p>
                    <a href="/" class="button secondary">חזרה לדף הבית</a>
                </div>
            </body>
            </html>
        `);
    }
};

// פונקציה להצגת כל התלונות למפקדים
export const adminView = async (req, res) => {
    const { password } = req.query;
    if (password === process.env.ADMIN_PASSWORD) {
        try {
            const complaints = await Complaint.find({}).sort({ createdAt: -1 });
            // יצירת דף HTML דינמי
            const complaintsList = complaints.map(complaint => `
                <div class="complaint-item">
                    <p><strong>Category:</strong> ${complaint.category}</p>
                    <p><strong>Message:</strong> ${complaint.message}</p>
                    <p><strong>Date:</strong> ${complaint.createdAt.toLocaleString('he-IL')}</p>
                </div>
            `).join('');

            res.send(`
                <!DOCTYPE html>
                <html lang="he" dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>צפייה בתלונות</title>
                    <link rel="stylesheet" href="style.css">
                    <style>
                        .complaint-item {
                            background-color: #f9f9f9;
                            border: 1px solid #ddd;
                            border-radius: 0.5rem;
                            padding: 1rem;
                            margin-bottom: 1rem;
                            text-align: right;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>רשימת תלונות אנונימיות</h1>
                        <a href="/" class="button primary">חזרה לדף הבית</a>
                        ${complaintsList}
                    </div>
                </body>
                </html>
            `);
        } catch (error) {
            console.error('Error fetching complaints:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        console.log('Access attempt with wrong password');
        res.status(403).send(`
            <!DOCTYPE html>
            <html lang="he" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>שגיאה</title>
                <link rel="stylesheet" href="style.css">
                <style>
                    .error-message {
                        color: #d32f2f;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="error-message">סיסמה שגויה!</h1>
                    <p class="description">נראה שלא עברת את מבחן הכניסה לפיקוד. חזור לדף הבית, ותקווה שאין לך תלונה שצריך לשלוח על זה.</p>
                    <a href="/" class="button secondary">חזרה לדף הבית</a>
                </div>
            </body>
            </html>
        `);
    }
};