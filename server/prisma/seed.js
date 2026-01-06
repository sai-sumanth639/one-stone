"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma_1 = __importDefault(require("../src/utils/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    const adminEmail = 'admin@marbleerp.local';
    const existing = await prisma_1.default.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
        const password = await bcryptjs_1.default.hash('Admin@123', 10);
        await prisma_1.default.user.create({
            data: {
                email: adminEmail,
                password,
                name: 'Admin',
                role: 'ADMIN',
            },
        });
        console.log('Seeded admin user');
    }
    else {
        console.log('Admin already exists');
    }
}
main()
    .then(async () => {
    await prisma_1.default.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma_1.default.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map