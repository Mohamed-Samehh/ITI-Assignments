from dateutil.relativedelta import relativedelta
from odoo import models, fields, api
from odoo.exceptions import ValidationError


class HmsPatient(models.Model):
    _name = 'hms.patient'
    _description = 'Patient'
    _rec_name = 'first_name'

    first_name = fields.Char(string='First Name', required=True)
    last_name = fields.Char(string='Last Name', required=True)
    birth_date = fields.Date(string='Birth Date')
    history = fields.Html(string='History')
    cr_ratio = fields.Float(string='CR Ratio')
    blood_type = fields.Selection([
        ('a+', 'A+'), ('a-', 'A-'),
        ('b+', 'B+'), ('b-', 'B-'),
        ('o+', 'O+'), ('o-', 'O-'),
        ('ab+', 'AB+'), ('ab-', 'AB-'),
    ], string='Blood Type')
    pcr = fields.Boolean(string='PCR')
    image = fields.Binary(string='Image')
    address = fields.Text(string='Address')
    age = fields.Integer(string='Age', compute='_compute_age', store=True)

    state = fields.Selection([
        ('undetermined', 'Undetermined'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('serious', 'Serious'),
    ], string='State', default='undetermined')

    # only open departments can be selected (domain enforces this)
    department_id = fields.Many2one(
        'hms.department', string='Department',
        domain=[('is_opened', '=', True)]
    )
    # pulled automatically from the selected department
    department_capacity = fields.Integer(
        related='department_id.capacity',
        string='Department Capacity', readonly=True
    )
    doctor_ids = fields.Many2many(
        'hms.doctors', 'hms_patient_doctor_rel', 'patient_id', 'doctor_id',
        string='Doctors')

    @api.depends('birth_date')
    def _compute_age(self):
        today = fields.Date.today()
        for rec in self:
            if rec.birth_date:
                rec.age = relativedelta(today, rec.birth_date).years
            else:
                rec.age = 0

    @api.onchange('birth_date')
    def _onchange_birth_date(self):
        # auto-check PCR and warn if computed age is under 30
        if self.birth_date:
            age = relativedelta(fields.Date.today(), self.birth_date).years
            if age < 30:
                self.pcr = True
                return {
                    'warning': {
                        'title': 'PCR Automatically Checked',
                        'message': 'PCR has been checked because the patient age is under 30.',
                    }
                }

    @api.constrains('pcr', 'cr_ratio')
    def _check_cr_ratio(self):
        # CR ratio is mandatory when PCR is checked
        for rec in self:
            if rec.pcr and not rec.cr_ratio:
                raise ValidationError('CR Ratio is required when PCR is checked.')
