import User from '../models/User.js';

class UserService {
  async getAllUsers(filters = {}) {
    const query = { activo: true, ...filters };
    const users = await User.find(query).select('-password').sort({ nombre: 1 });
    return users;
  }

  async getUserById(id) {
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  async createUser(userData) {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const user = await User.create(userData);
    
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
  }

  async updateUser(id, updateData) {
    // No permitir actualizar password desde aquí
    delete updateData.password;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  async deleteUser(id) {
    // Soft delete
    const user = await User.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  async getComprometidos() {
    const comprometidos = await User.find({
      rol: 'comprometido',
      activo: true
    }).select('-password').sort({ nombre: 1 });

    return comprometidos;
  }

  async updateMontoComprometido(id, monto) {
    const user = await User.findByIdAndUpdate(
      id,
      { montoComprometido: monto },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.rol !== 'comprometido') {
      throw new Error('El usuario no es un comprometido');
    }

    return user;
  }
}

export default new UserService();
