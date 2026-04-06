import { auth } from '../src/lib/auth';

async function main() {
    try {
        console.log('🌱 Starting seed...');

        const user = await auth.api.signUpEmail({
            body: {
                name: 'Admin',
                email: 'test@example.com',
                password: 'password',
            },
        });

        console.log('✅ Admin user created successfully');
        console.log('📧 Email: test@example.com');
        console.log('🔐 Password: password');
        console.log('👤 User ID:', user.user.id);
    } catch (error) {
        console.error('❌ Seed error:', error);
        throw error;
    }
}

main();
