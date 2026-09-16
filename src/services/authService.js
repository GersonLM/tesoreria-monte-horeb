import User from '../models/User.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../helpers/jwt.js';

class AuthService {
  async register(userData) {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Crear usuario
    const user = await User.create(userData);
    
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, accessToken, refreshToken };
  }

  async login(email, password) {
    // Buscar usuario con password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.activo) {
      throw new Error('Usuario inactivo');
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, accessToken, refreshToken };
  }

  async refresh(token) {
    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      throw new Error('Refresh token inválido o expirado');
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.activo) {
      throw new Error('Usuario no encontrado o inactivo');
    }

    const accessToken = generateToken(user._id);
    return { accessToken };
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
