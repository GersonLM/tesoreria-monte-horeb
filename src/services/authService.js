import User from '../models/User.js';
import { generateToken } from '../helpers/jwt.js';

class AuthService {
  async register(userData) {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Crear usuario
    const user = await User.create(userData);
    
    // Generar token
    const token = generateToken(user._id);

    // Retornar usuario sin password
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  async login(email, password) {
    // Buscar usuario con password
    const user = await User.findOne({ email }).select('+password');

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);
    console.log(isValidPassword)
    
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.activo) {
      throw new Error('Usuario inactivo');
    }

    // Generar token
    const token = generateToken(user._id);

    // Retornar usuario sin password
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  async updateProfile(userId, updateData) {
    // No permitir actualizar password, email o rol desde aquí
    delete updateData.password;
    delete updateData.email;
    delete updateData.rol;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }
}

export default new AuthService();
