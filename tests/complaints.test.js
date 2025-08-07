import request from 'supertest';
import mongoose from 'mongoose';
import Complaint from '../models/complaint.model.js';
import { app } from '../app.js'; // צריך לייצא את app מקובץ השרת

// בדיקות לפני ואחרי
beforeAll(async () => {
  // צריך להתחבר למסד נתונים לבדיקות
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  // ניקוי הדאטה בייס אחרי הבדיקות
  await Complaint.deleteMany({});
  await mongoose.connection.close();
});

describe('Complaint Model Unit Tests', () => {
  it('should create and save a complaint successfully', async () => {
    const complaintData = {
      category: 'food',
      message: 'The food is terrible, as expected.',
    };
    const validComplaint = new Complaint(complaintData);
    const savedComplaint = await validComplaint.save();
    expect(savedComplaint._id).toBeDefined();
    expect(savedComplaint.category).toBe(complaintData.category);
    expect(savedComplaint.message).toBe(complaintData.message);
  });

  it('should not save a complaint without a message', async () => {
    const invalidComplaint = new Complaint({ category: 'equipment' });
    let err;
    try {
      await invalidComplaint.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.message).toBeDefined();
  });
});

describe('Complaints API Integration Tests', () => {
  it('should submit a new complaint via POST /submit', async () => {
    const complaintData = {
      category: 'commands',
      message: 'New command is illogical and stupid.',
    };
    const res = await request(app)
      .post('/submit')
      .send(complaintData);

    expect(res.statusCode).toBe(201);
    expect(res.text).toContain('התלונה התקבלה בהצלחה!');

    const savedComplaint = await Complaint.findOne({ message: complaintData.message });
    expect(savedComplaint).toBeDefined();
    expect(savedComplaint.category).toBe(complaintData.category);
  });

  it('should not allow access to /admin with wrong password', async () => {
    const res = await request(app)
      .get('/admin')
      .query({ password: 'wrong-password' });
    
    expect(res.statusCode).toBe(403);
    expect(res.text).toContain('סיסמה שגויה!');
  });

  it('should allow access to /admin with correct password and show complaints', async () => {
    // קודם כל נייצר תלונה כדי שיהיה מה להציג
    await Complaint.create({ category: 'other', message: 'This system is so depressing.' });

    const res = await request(app)
      .get('/admin')
      .query({ password: process.env.ADMIN_PASSWORD });
    
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('רשימת תלונות אנונימיות');
    expect(res.text).toContain('This system is so depressing.');
  });
});