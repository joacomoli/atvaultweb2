import { Handlers } from "$fresh/server.ts";
import { connectDB } from "../../utils/db.ts";
import { IUser, USERS_COLLECTION, createUser, UserRole } from "../../models/User.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      const { name, email, password } = body;

      if (!name || !email || !password) {
        return new Response(
          JSON.stringify({ error: "Todos los campos son obligatorios" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const db = await connectDB();
      
      // Verificar si el email ya existe
      const existingUser = await db.collection<IUser>(USERS_COLLECTION).findOne({ email });
      if (existingUser) {
        return new Response(
          JSON.stringify({ error: "El email ya está registrado" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Crear el usuario
      const userData = {
        name,
        email,
        password,
        role: UserRole.STANDARD,
      };

      const user = await createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      await db.collection(USERS_COLLECTION).insertOne(user);

      return new Response(JSON.stringify(userWithoutPassword), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error en registro:", error);
      return new Response(
        JSON.stringify({ error: "Error al crear el usuario" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
}; 