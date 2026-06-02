from odoo import models, fields


class HmsDoctors(models.Model):
    _name = 'hms.doctors'
    _description = 'Doctor'
    _rec_name = 'first_name'

    first_name = fields.Char(string='First Name', required=True)
    last_name = fields.Char(string='Last Name', required=True)
    image = fields.Binary(string='Image')

    # patients assigned to this doctor (reverse of hms.patient.doctor_ids)
    patient_ids = fields.Many2many(
        'hms.patient', 'hms_patient_doctor_rel', 'doctor_id', 'patient_id',
        string='Patients')
