const swaggerJSDoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 5001;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bright Smile API',
      version: '1.0.0',
      description: 'API documentation for Bright Smile web backend.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UserRole: {
          type: 'string',
          enum: ['patient', 'staff', 'admin'],
          example: 'patient',
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'phone', 'password'],
          properties: {
            username: { type: 'string', example: 'ayoub' },
            email: { type: 'string', format: 'email', example: 'ayoub@example.com' },
            phone: { type: 'string', example: '+212612345678' },
            password: { type: 'string', format: 'password', example: 'P@ssword123!' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'ayoub' },
            password: { type: 'string', format: 'password', example: 'P@ssword123!' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful' },
            token: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.9lW9gCVnQy8COkOL9VShvXKn0zs',
            },
          },
        },
        MeResponse: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'ayoub' },
            email: { type: 'string', format: 'email', example: 'ayoub@example.com' },
            phone: { type: 'string', example: '+212612345678' },
            role: { $ref: '#/components/schemas/UserRole' },
          },
        },
        MessageCreateRequest: {
          type: 'object',
          required: ['name', 'email', 'subject', 'message'],
          properties: {
            name: { type: 'string', example: 'Ayoub Test' },
            email: { type: 'string', format: 'email', example: 'ayoub@example.com' },
            phone: { type: 'string', example: '+212612345678' },
            subject: { type: 'string', example: 'Teeth Whitening' },
            message: { type: 'string', example: 'I want to know the available appointment dates.' },
          },
        },
        MessageUpdateRequest: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['new', 'in_progress', 'closed'], example: 'in_progress' },
            staff_note: { type: 'string', example: 'Patient asked for next week availability.' },
          },
        },
        BookingCreateRequest: {
          type: 'object',
          required: ['fullName', 'phone', 'service', 'appointmentDate'],
          properties: {
            fullName: { type: 'string', example: 'Ayoub Benali' },
            phone: { type: 'string', example: '+212612345678' },
            service: { type: 'string', example: 'Consultation' },
            appointmentDate: { type: 'string', format: 'date-time', example: '2026-05-20T10:00:00.000Z' },
            notes: { type: 'string', example: 'First visit.' },
          },
        },
        AppointmentUpdateRequest: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'completed', 'cancelled'],
              example: 'confirmed',
            },
            assignedStaffId: { type: 'integer', example: 4 },
            notes: { type: 'string', example: 'Bring previous x-ray if available.' },
          },
        },
        TestimonialCreateRequest: {
          type: 'object',
          required: ['content', 'rating'],
          properties: {
            content: { type: 'string', example: 'Excellent clinic and very professional staff.' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
          },
        },
        UserRoleUpdateRequest: {
          type: 'object',
          required: ['role'],
          properties: {
            role: { $ref: '#/components/schemas/UserRole' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' },
          },
        },
        GenericSuccessResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operation completed successfully' },
          },
        },
      },
    },
    paths: {
      '/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/GenericSuccessResponse' },
                  examples: { success: { value: { message: 'User registered successfully' } } },
                },
              },
            },
            400: {
              description: 'Validation error or duplicate user',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  examples: { duplicate: { value: { message: 'Username or email already exists' } } },
                },
              },
            },
            500: { description: 'Server error' },
          },
        },
      },
      '/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and get JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginResponse' },
                },
              },
            },
            401: { description: 'Invalid credentials' },
            500: { description: 'Server error' },
          },
        },
      },
      '/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current logged-in user',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Current user returned',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/MeResponse' },
                },
              },
            },
            401: { description: 'Unauthorized' },
            500: { description: 'Server error' },
          },
        },
      },
      '/api/dashboard/overview': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get admin overview statistics',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Overview stats returned' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/api/messages': {
        get: {
          tags: ['Messages'],
          summary: 'Get all messages (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Messages returned' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
          },
        },
        post: {
          tags: ['Messages'],
          summary: 'Create a new message',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MessageCreateRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Message created' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/messages/{id}': {
        get: {
          tags: ['Messages'],
          summary: 'Get one message (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Message returned' },
            404: { description: 'Not found' },
          },
        },
        put: {
          tags: ['Messages'],
          summary: 'Update a message (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MessageUpdateRequest' },
              },
            },
          },
          responses: {
            200: { description: 'Message updated' },
          },
        },
        delete: {
          tags: ['Messages'],
          summary: 'Delete a message (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Message deleted' },
          },
        },
      },
      '/api/gallery': {
        get: {
          tags: ['Gallery'],
          summary: 'Get public gallery',
          responses: {
            200: { description: 'Gallery returned' },
          },
        },
        post: {
          tags: ['Gallery'],
          summary: 'Create gallery case (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: 'Case created' },
          },
        },
      },
      '/api/gallery/{id}': {
        patch: {
          tags: ['Gallery'],
          summary: 'Update gallery case (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Case updated' },
          },
        },
        delete: {
          tags: ['Gallery'],
          summary: 'Delete gallery case (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Case deleted' },
          },
        },
      },
      '/api/appointments/book': {
        post: {
          tags: ['Appointments'],
          summary: 'Create patient booking',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BookingCreateRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Booking created' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/appointments': {
        get: {
          tags: ['Appointments'],
          summary: 'List appointments (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Appointments returned' },
          },
        },
      },
      '/api/appointments/{id}': {
        patch: {
          tags: ['Appointments'],
          summary: 'Update appointment (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AppointmentUpdateRequest' },
              },
            },
          },
          responses: {
            200: { description: 'Appointment updated' },
          },
        },
        delete: {
          tags: ['Appointments'],
          summary: 'Delete appointment (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Appointment deleted' },
          },
        },
      },
      '/api/appointments/export/csv': {
        get: {
          tags: ['Appointments'],
          summary: 'Export appointments as CSV (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'CSV exported' },
          },
        },
      },
      '/api/appointments/staff': {
        get: {
          tags: ['Appointments'],
          summary: 'List staff for assignment (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Staff list returned' },
          },
        },
      },
      '/api/testimonials': {
        get: {
          tags: ['Testimonials'],
          summary: 'Get public testimonials',
          responses: {
            200: { description: 'Testimonials returned' },
          },
        },
      },
      '/api/admin/testimonials': {
        get: {
          tags: ['Admin Testimonials'],
          summary: 'List testimonials (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Testimonials returned' },
          },
        },
      },
      '/api/admin/testimonials/{id}': {
        patch: {
          tags: ['Admin Testimonials'],
          summary: 'Update testimonial (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Testimonial updated' },
          },
        },
        delete: {
          tags: ['Admin Testimonials'],
          summary: 'Delete testimonial (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Testimonial deleted' },
          },
        },
      },
      '/api/admin/users': {
        get: {
          tags: ['Admin Users'],
          summary: 'List all users (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Users returned' },
          },
        },
      },
      '/api/admin/users/staff': {
        get: {
          tags: ['Admin Users'],
          summary: 'List staff users (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Staff users returned' },
          },
        },
        post: {
          tags: ['Admin Users'],
          summary: 'Create staff user (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            201: { description: 'Staff user created' },
          },
        },
      },
      '/api/admin/users/staff/{id}': {
        patch: {
          tags: ['Admin Users'],
          summary: 'Update staff user (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Staff user updated' },
          },
        },
        delete: {
          tags: ['Admin Users'],
          summary: 'Delete staff user (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Staff user deleted' },
          },
        },
      },
      '/api/admin/users/{id}/role': {
        patch: {
          tags: ['Admin Users'],
          summary: 'Update user role (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserRoleUpdateRequest' },
              },
            },
          },
          responses: {
            200: { description: 'User role updated' },
          },
        },
      },
      '/api/my/account': {
        delete: {
          tags: ['My Portal'],
          summary: 'Delete my account',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Account deleted' },
          },
        },
      },
      '/api/my/threads': {
        get: {
          tags: ['My Portal'],
          summary: 'Get my message threads',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Threads returned' },
          },
        },
      },
      '/api/my/threads/{threadId}/messages': {
        get: {
          tags: ['My Portal'],
          summary: 'Get my thread messages',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'threadId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Thread messages returned' },
          },
        },
        post: {
          tags: ['My Portal'],
          summary: 'Reply to my thread',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'threadId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            201: { description: 'Reply posted' },
          },
        },
      },
      '/api/my/appointments': {
        get: {
          tags: ['My Portal'],
          summary: 'List my appointments',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Appointments returned' },
          },
        },
      },
      '/api/my/testimonials': {
        get: {
          tags: ['My Portal'],
          summary: 'List my testimonials',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Testimonials returned' },
          },
        },
        post: {
          tags: ['My Portal'],
          summary: 'Create my testimonial',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TestimonialCreateRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Testimonial created' },
          },
        },
      },
      '/api/my/testimonials/{id}': {
        delete: {
          tags: ['My Portal'],
          summary: 'Delete my testimonial',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: {
            200: { description: 'Testimonial deleted' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };
