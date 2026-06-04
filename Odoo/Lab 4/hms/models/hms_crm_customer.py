from odoo import models, fields, api
from odoo.exceptions import ValidationError


class ResPartner(models.Model):
    _inherit = 'res.partner'

    related_patient_id = fields.Many2one('hms.patient', string='Related Patient')

    @api.constrains('related_patient_id')
    def _check_patient_email_unique(self):
        # prevent linking a patient whose email is already used by another customer
        for rec in self:
            if rec.related_patient_id and rec.related_patient_id.email:
                email = rec.related_patient_id.email
                duplicate = self.search([
                    ('related_patient_id.email', '=', email),
                    ('related_patient_id', '!=', False),
                    ('id', '!=', rec.id),
                ])
                if duplicate:
                    raise ValidationError(
                        f'Patient email "{email}" is already linked to another customer.'
                    )

    @api.constrains('vat', 'customer_rank')
    def _check_customer_vat(self):
        # Tax ID is required for customers
        for rec in self:
            if rec.customer_rank > 0 and not rec.vat:
                raise ValidationError('Tax ID (VAT) is required for customers.')

    def unlink(self):
        # prevent deleting a customer that is linked to a patient
        for rec in self:
            if rec.related_patient_id:
                raise ValidationError(
                    f'Cannot delete "{rec.name}" because they are linked to a patient.'
                )
        return super().unlink()
