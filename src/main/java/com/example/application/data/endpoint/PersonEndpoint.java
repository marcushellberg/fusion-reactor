package com.example.application.data.endpoint;

import java.util.List;
import com.example.application.data.entity.Person;
import com.example.application.data.service.PersonRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.fusion.Endpoint;
import com.vaadin.fusion.Nonnull;

@Endpoint
@AnonymousAllowed
public class PersonEndpoint {

    private PersonRepository repo;

    public PersonEndpoint(PersonRepository repo) {
        this.repo = repo;
    }

    @Nonnull
    public List<@Nonnull Person> findAll() throws InterruptedException {
        // Simulate slow backend call
        Thread.sleep(2000);
        return repo.findAll();
    }

    @Nonnull
    public Person update(@Nonnull Person entity) {
        return repo.save(entity);
    }

    public void delete(@Nonnull Integer id) {
        repo.deleteById(id);
    }
}
