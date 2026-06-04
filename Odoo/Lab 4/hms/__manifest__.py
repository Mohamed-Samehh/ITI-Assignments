{
    'name': 'Hospital Management System',
    'version': '1.0',
    'depends': ['base', 'contacts'],
    'application': True,
    'data': [
        'security/ir.model.access.csv',
        'views/hms_patient_views.xml',
        'views/hms_department_views.xml',
        'views/hms_doctors_views.xml',
        'views/hms_crm_customer_views.xml',
    ],
}
