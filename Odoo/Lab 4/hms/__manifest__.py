{
    'name': 'Hospital Management System',
    'version': '1.0',
    'license': 'LGPL-3',
    'depends': ['base', 'contacts', 'mail'],
    'application': True,
    'data': [
        'security/hms_security.xml',
        'security/ir.model.access.csv',
        'views/hms_patient_views.xml',
        'views/hms_department_views.xml',
        'views/hms_doctors_views.xml',
        'views/hms_crm_customer_views.xml',
        'reports/hms_patient_report.xml',
    ],
}
