import { FileNode } from '../types';

class VirtualFileSystem {
  root: FileNode;

  constructor() {
    this.root = {
      name: 'root',
      type: 'directory',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      children: {
        'home': {
          name: 'home',
          type: 'directory',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          children: {
            'user': {
              name: 'user',
              type: 'directory',
              createdAt: Date.now(),
              updatedAt: Date.now(),
              children: {
                'readme.txt': {
                  name: 'readme.txt',
                  type: 'file',
                  content: 'Welcome to WebOS x86!\n\nThis is a fully featured web-based operating system.\nIt includes a working x86 emulator, terminal, file explorer, and more.\n\nEnjoy exploring!',
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                },
                'system_info.txt': {
                  name: 'system_info.txt',
                  type: 'file',
                  content: 'OS: WebOS x86\nVersion: 1.0.0\nKernel: React/Vite\nArchitecture: WASM/x86 Emulation',
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                }
              }
            }
          }
        },
        'bin': {
          name: 'bin',
          type: 'directory',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          children: {}
        },
        'etc': {
          name: 'etc',
          type: 'directory',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          children: {}
        }
      }
    };
  }

  private resolvePath(path: string): { parent: FileNode | null, node: FileNode | null, name: string } {
    const parts = path.split('/').filter(p => p.length > 0);
    let current = this.root;
    let parent: FileNode | null = null;

    if (parts.length === 0) return { parent: null, node: this.root, name: 'root' };

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (current.type !== 'directory' || !current.children) {
        return { parent: null, node: null, name: part };
      }
      
      parent = current;
      current = current.children[part];
      
      if (!current) {
        if (i === parts.length - 1) {
          return { parent, node: null, name: part };
        }
        return { parent: null, node: null, name: part };
      }
    }

    return { parent, node: current, name: parts[parts.length - 1] };
  }

  readFile(path: string): string {
    const { node } = this.resolvePath(path);
    if (!node) throw new Error(`File not found: ${path}`);
    if (node.type === 'directory') throw new Error(`Is a directory: ${path}`);
    return node.content || '';
  }

  writeFile(path: string, content: string): void {
    const { parent, node, name } = this.resolvePath(path);
    if (!parent || parent.type !== 'directory' || !parent.children) {
      throw new Error(`Invalid path: ${path}`);
    }

    if (node) {
      if (node.type === 'directory') throw new Error(`Is a directory: ${path}`);
      node.content = content;
      node.updatedAt = Date.now();
    } else {
      parent.children[name] = {
        name,
        type: 'file',
        content,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    }
    this.saveToStorage();
  }

  readDir(path: string): FileNode[] {
    const { node } = this.resolvePath(path);
    if (!node) throw new Error(`Directory not found: ${path}`);
    if (node.type !== 'directory' || !node.children) throw new Error(`Not a directory: ${path}`);
    return Object.values(node.children);
  }

  makeDir(path: string): void {
    const { parent, node, name } = this.resolvePath(path);
    if (!parent || parent.type !== 'directory' || !parent.children) {
      throw new Error(`Invalid path: ${path}`);
    }
    if (node) throw new Error(`File or directory already exists: ${path}`);

    parent.children[name] = {
      name,
      type: 'directory',
      children: {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.saveToStorage();
  }

  remove(path: string): void {
    const { parent, node, name } = this.resolvePath(path);
    if (!parent || !parent.children) throw new Error(`Invalid path: ${path}`);
    if (!node) throw new Error(`File or directory not found: ${path}`);

    delete parent.children[name];
    this.saveToStorage();
  }

  exists(path: string): boolean {
    const { node } = this.resolvePath(path);
    return node !== null;
  }

  private saveToStorage() {
    try {
      localStorage.setItem('webos_vfs', JSON.stringify(this.root));
    } catch (e) {
      console.warn('Failed to save VFS to localStorage', e);
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('webos_vfs');
      if (data) {
        this.root = JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load VFS from localStorage', e);
    }
  }
}

export const vfs = new VirtualFileSystem();
vfs.loadFromStorage();
