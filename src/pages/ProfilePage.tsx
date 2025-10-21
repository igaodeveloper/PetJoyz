import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  name: z.string().min(2, 'Insira um nome válido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'A nova senha deve ter ao menos 6 caracteres').or(z.undefined()),
})

type ProfileForm = z.infer<typeof profileSchema>

const mockOrders = [
  { id: 'PJ-1001', date: '2025-09-02', total: 'R$ 129,90', status: 'Entregue' },
  { id: 'PJ-1002', date: '2025-09-24', total: 'R$ 59,90', status: 'Em transporte' },
]

export default function ProfilePage() {
  const methods = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '+55 11 9XXXX-XXXX',
    },
  })

  const { handleSubmit, register, formState, reset } = methods

  const onSubmit = (data: ProfileForm) => {
    // Aqui você integraria com API de usuário
    console.log('Salvar perfil', data)
    // feedback simples
    alert('Perfil salvo com sucesso (mock)')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - profile card */}
        <Card className="order-1 lg:order-none">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/images/avatar-placeholder.png" alt="Avatar" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">João Silva</CardTitle>
                <CardDescription>Cliente desde 2023 · Nível: Silver</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Resumo</p>
              <ul className="text-sm">
                <li>Pedidos: {mockOrders.length}</li>
                <li>Endereços salvos: 2</li>
                <li>Favoritos: 8</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost">Editar foto</Button>
            <Button className="ml-auto">Ver pedidos</Button>
          </CardFooter>
        </Card>

        {/* Center column - profile form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações pessoais</CardTitle>
              <CardDescription>Atualize seus dados de contato e senha.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...register('name')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...register('email')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...register('phone')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <div className="space-y-2">
                      <FormItem>
                        <FormLabel>Senha atual</FormLabel>
                        <FormControl>
                          <Input type="password" {...register('currentPassword')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>Nova senha</FormLabel>
                        <FormControl>
                          <Input type="password" {...register('newPassword')} />
                        </FormControl>
                        <FormDescription>Deixe em branco para manter a senha atual.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button type="submit">Salvar</Button>
                    <Button type="button" variant="ghost" onClick={() => reset()}>
                      Redefinir
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Orders and preferences */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos recentes</CardTitle>
                <CardDescription>Últimos pedidos realizados na sua conta.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockOrders.map((o) => (
                    <div key={o.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{o.id}</div>
                        <div className="text-sm text-muted-foreground">{o.date} · {o.status}</div>
                      </div>
                      <div className="font-semibold">{o.total}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Gerencie notificações e preferências.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Notificações por email</div>
                      <div className="text-muted-foreground">Receber novidades e promoções</div>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">Marketing personalizado</div>
                      <div className="text-muted-foreground">Ofertas baseadas no seu histórico</div>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
