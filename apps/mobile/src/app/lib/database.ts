import * as SQLite from 'expo-sqlite'
import { useState, useEffect } from 'react'

export interface Project {
  id: string
  name: string
  description: string
  target_budget: number
  current_funding: number
  status: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  points: number
  created_at: string
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync('makethechange.db')
      await this.createTables()
      console.log('Database initialized successfully')
    } catch (error) {
      console.error('Failed to initialize database:', error)
      throw error
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized')

    // Create projects table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        target_budget INTEGER NOT NULL,
        current_funding INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `)

    // Create users table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        points INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `)

    // Create user_projects junction table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_projects (
        user_id TEXT,
        project_id TEXT,
        investment_amount INTEGER,
        created_at TEXT NOT NULL,
        PRIMARY KEY (user_id, project_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
    `)
  }

  // Projects CRUD operations
  async getProjects(): Promise<Project[]> {
    if (!this.db) throw new Error('Database not initialized')
    
    const result = await this.db.getAllAsync<Project>(
      'SELECT * FROM projects ORDER BY created_at DESC'
    )
    return result
  }

  async getProject(id: string): Promise<Project | null> {
    if (!this.db) throw new Error('Database not initialized')
    
    const result = await this.db.getFirstAsync<Project>(
      'SELECT * FROM projects WHERE id = ?', [id]
    )
    return result || null
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    if (!this.db) throw new Error('Database not initialized')
    
    const now = new Date().toISOString()
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newProject: Project = {
      id,
      ...project,
      created_at: now,
      updated_at: now
    }
    
    await this.db.runAsync(
      `INSERT INTO projects (id, name, description, target_budget, current_funding, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, project.name, project.description, project.target_budget, project.current_funding, project.status, now, now]
    )
    
    return newProject
  }

  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Promise<Project | null> {
    if (!this.db) throw new Error('Database not initialized')
    
    const updateFields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at')
    if (updateFields.length === 0) return null
    
    const setClause = updateFields.map(field => `${field} = ?`).join(', ')
    const values = updateFields.map(field => updates[field as keyof Project])
    values.push(new Date().toISOString()) // updated_at
    values.push(id)
    
    await this.db.runAsync(
      `UPDATE projects SET ${setClause}, updated_at = ? WHERE id = ?`,
      values
    )
    
    return this.getProject(id)
  }

  async deleteProject(id: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized')
    
    const result = await this.db.runAsync('DELETE FROM projects WHERE id = ?', [id])
    return result.changes > 0
  }

  // Users CRUD operations
  async getUser(id: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized')
    
    const result = await this.db.getFirstAsync<User>(
      'SELECT * FROM users WHERE id = ?', [id]
    )
    return result || null
  }

  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    if (!this.db) throw new Error('Database not initialized')
    
    const now = new Date().toISOString()
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newUser: User = {
      id,
      ...user,
      created_at: now
    }
    
    await this.db.runAsync(
      'INSERT INTO users (id, name, email, points, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, user.name, user.email, user.points, now]
    )
    
    return newUser
  }

  async updateUserPoints(id: string, points: number): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized')
    
    await this.db.runAsync(
      'UPDATE users SET points = ? WHERE id = ?',
      [points, id]
    )
    
    return this.getUser(id)
  }

  // User investment operations
  async investInProject(userId: string, projectId: string, amount: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized')
    
    try {
      await this.db.withTransactionAsync(async () => {
        // Add investment record
        await this.db.runAsync(
          'INSERT OR REPLACE INTO user_projects (user_id, project_id, investment_amount, created_at) VALUES (?, ?, ?, ?)',
          [userId, projectId, amount, new Date().toISOString()]
        )
        
        // Update project funding
        await this.db.runAsync(
          'UPDATE projects SET current_funding = current_funding + ?, updated_at = ? WHERE id = ?',
          [amount, new Date().toISOString(), projectId]
        )
        
        // Deduct user points
        await this.db.runAsync(
          'UPDATE users SET points = points - ? WHERE id = ?',
          [amount, userId]
        )
      })
      
      return true
    } catch (error) {
      console.error('Investment failed:', error)
      return false
    }
  }

  async getUserInvestments(userId: string): Promise<Project[]> {
    if (!this.db) throw new Error('Database not initialized')
    
    const result = await this.db.getAllAsync<Project>(
      `SELECT p.* FROM projects p
       INNER JOIN user_projects up ON p.id = up.project_id
       WHERE up.user_id = ?
       ORDER BY up.created_at DESC`,
      [userId]
    )
    return result
  }

  async close() {
    if (this.db) {
      await this.db.closeAsync()
      this.db = null
    }
  }
}

export const database = new DatabaseService()

// React hook for database operations
export function useDatabase() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        await database.init()
        setIsReady(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Database initialization failed')
      }
    }

    init()

    return () => {
      database.close()
    }
  }, [])

  return { isReady, error, database }
}
